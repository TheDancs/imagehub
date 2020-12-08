using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.User.Commands.AddUser
{
    public class AddUserCommand : IRequest
    {
        public string Id { get; }
        public string Name { get; }
        public string Email { get; }
        public string ProfilePictureUrl { get; }

        public AddUserCommand(string id, string name, string email, string profilePictureUrl)
        {
            Id = id;
            Name = name;
            Email = email;
            ProfilePictureUrl = profilePictureUrl;
        }

        public class Handler : IRequestHandler<AddUserCommand>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<Unit> Handle(AddUserCommand request, CancellationToken cancellationToken)
            {
                var queryResult = await database.Users.FindAsync(request.Id);
                if (queryResult != null)
                {
                    return Unit.Value;
                }

                await database.Users.AddAsync(new Domain.Entities.User()
                {
                    Id = request.Id, Email = request.Email, Name = request.Name,
                    ProfilePictureUrl = request.ProfilePictureUrl
                }, cancellationToken);

                await database.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
