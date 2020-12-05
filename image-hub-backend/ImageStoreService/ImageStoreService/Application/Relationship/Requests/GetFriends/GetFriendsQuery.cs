using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.Relationship.Requests.GetFriends
{
    public class GetFriendsQuery : IRequest<IEnumerable<UserModel>>
    {
        public string UserId { get; }

        public GetFriendsQuery(string userId)
        {
            UserId = userId;
        }

        public class Handler : IRequestHandler<GetFriendsQuery, IEnumerable<UserModel>>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<IEnumerable<UserModel>> Handle(GetFriendsQuery request, CancellationToken cancellationToken)
            {
                var friends = await database.Relationships.Include(x => x.User1).Include(x => x.User2)
                    .Where(x => x.UserId1 == request.UserId || x.UserId2 == request.UserId).ToListAsync(cancellationToken: cancellationToken);

                var friendsList = new List<UserModel>();

                friendsList.AddRange(friends.Where(x => x.UserId1 != request.UserId).Select(x => new UserModel()
                {
                    Id = x.User1.Id,
                    Name = x.User1.Name,
                    Email = x.User1.Email,
                    ProfilePictureUrl = x.User1.ProfilePictureUrl
                }));

                friendsList.AddRange(friends.Where(x => x.UserId2 != request.UserId).Select(x => new UserModel()
                {
                    Id = x.User2.Id,
                    Name = x.User2.Name,
                    Email = x.User2.Email,
                    ProfilePictureUrl = x.User2.ProfilePictureUrl
                }));

                return friendsList;
            }
        }
    }
}
