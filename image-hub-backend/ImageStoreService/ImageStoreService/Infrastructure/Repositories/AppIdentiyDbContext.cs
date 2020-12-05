using ImageHubService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Infrastructure.Repositories
{
    public class AppIdentityDbContext : DbContext
    {
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options) { }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<FriendRequest> FriendRequests { get; set; }
        public virtual DbSet<UserRelationship> Relationships { get; set; }
    }
}



