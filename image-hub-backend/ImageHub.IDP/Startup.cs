// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using IdentityServer4;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServerHost.Quickstart.UI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ImageHub.IDP
{
    public class Startup
    {
        private const string MIGRATION_ASSEMBLY = "ImageHub.IDP";

        public IWebHostEnvironment Environment { get; }
        public IConfiguration Configuration { get; }

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            Environment = environment;
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var dbConnectionString = Configuration["ImageHubDbConnectionString"];

            services.AddControllersWithViews();

            var builder = services.AddIdentityServer(options =>
            {
                options.EmitStaticAudienceClaim = true;
            })
                .AddTestUsers(TestUsers.Users);

            builder.AddConfigurationStore(options =>
            {
                options.ConfigureDbContext = optionsBuilder => optionsBuilder.UseSqlServer(dbConnectionString, sqlOptions => sqlOptions.MigrationsAssembly(MIGRATION_ASSEMBLY));
            });

            builder.AddOperationalStore(configure =>
            {
                configure.ConfigureDbContext = options => options.UseSqlServer(dbConnectionString, sqlOptions => sqlOptions.MigrationsAssembly(MIGRATION_ASSEMBLY));
            });

            services.AddAuthentication()
                .AddFacebook("Facebook", options =>
                {
                    options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

                    options.ClientId = Configuration["FacebookAppId"];
                    options.ClientSecret = Configuration["FacebookAppSecret"];
                    options.Scope.Add("email");
                    options.Fields.Add("id");
                    options.SaveTokens = true;
                });

            if (Environment.IsDevelopment())
            {
                builder.AddDeveloperSigningCredential();
            }
            else
            {
                var key = Configuration["IdentityServerCertificate"];
                var pfxBytes = Convert.FromBase64String(key);
                var cert = new X509Certificate2(pfxBytes, (string)null, X509KeyStorageFlags.MachineKeySet);
                builder.AddSigningCredential(cert);
            }
            services.AddApplicationInsightsTelemetry(Configuration["APPINSIGHTS_CONNECTIONSTRING"]);
        }

        public void Configure(IApplicationBuilder app)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            InitializeDatabase(app);

            app.UseStaticFiles();
            app.UseRouting();

            app.UseIdentityServer();

            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });
        }

        private void InitializeDatabase(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();

            serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();

            var context = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
            context.Database.Migrate();

            foreach (var client in Config.Clients)
            {
                var existing = context.Clients.Include(x=>x.AllowedScopes).FirstOrDefault(x => x.ClientId == client.ClientId);
                if (existing != null)
                {
                    context.Clients.Update(existing);
                }
                else
                {
                    context.Clients.Add(client.ToEntity());
                }
            }
            context.SaveChanges();

            if (!context.IdentityResources.Any())
            {
                foreach (var resource in Config.IdentityResources)
                {
                    context.IdentityResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }

            if (!context.ApiResources.Any())
            {
                foreach (var resource in Config.ApiResources)
                {
                    context.ApiResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }
        }
    }
}
