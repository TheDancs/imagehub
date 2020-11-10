using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Domain.Entities;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.User.Requests.GetUserById
{
    public class GetUserByIdCommand : IRequest<UserModel>
    {
        public string RequestedByUser { get; }
        public string UserId { get; }

        public GetUserByIdCommand(string userId, string requestedByUser)
        {
            UserId = userId;
            RequestedByUser = requestedByUser;
        }

        public class Handler : IRequestHandler<GetUserByIdCommand, UserModel>
        {
            private readonly AppIdentityDbContext _database;
            private readonly IUserStore<ApplicationUser> userStore;

            public Handler(AppIdentityDbContext database, IUserStore<ApplicationUser> userStore)
            {
                _database = database;
                this.userStore = userStore;
            }

            public async Task<UserModel> Handle(GetUserByIdCommand request, CancellationToken cancellationToken)
            {
                var user = await userStore.FindByIdAsync(request.UserId, cancellationToken).ConfigureAwait(false);
                if (user != null)
                {
                    var friends = await _database.Relationships.Where(x =>
                        x.UserId1 == request.UserId || x.UserId2 == request.UserId)
                        .Include(y => y.User1)
                        .Include(x=>x.User2)
                        .ToListAsync(cancellationToken: cancellationToken);

                    return new UserModel()
                    {
                        Email = user.Email,
                        Friends = friends.Select(x => ConvertToUserMeta(x, request.UserId)).ToList(),
                        Name = user.UserName,
                        ProfilePicture = user.ProfilePicture,
                        UserId = user.Id
                    };
                }

                return null;
            }

            private UserMetaModel ConvertToUserMeta(UserRelationship x, string userId)
            {
                if (x.UserId1 != userId)
                {
                    return new UserMetaModel() { Id = x.UserId1, Name = x.User1.UserName };
                }

                return new UserMetaModel() { Id = x.UserId2, Name = x.User2.UserName };
            }
        }
    }
}
