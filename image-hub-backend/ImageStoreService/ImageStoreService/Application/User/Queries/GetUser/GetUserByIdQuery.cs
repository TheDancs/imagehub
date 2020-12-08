using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.User.Queries.GetUser
{
    public class GetUserByIdQuery : IRequest<UserSummaryModel>
    {
        public string UserId { get; }
        public string RequestFrom { get; }

        public GetUserByIdQuery(string userId, string requestFrom)
        {
            UserId = userId;
            RequestFrom = requestFrom;
        }

        public class Handler : IRequestHandler<GetUserByIdQuery, UserSummaryModel>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<UserSummaryModel> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
            {
                var friendStatus = 0;
                var result = await database.Users
                    .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken: cancellationToken);
                var friendsCount = await database.Relationships.CountAsync(x => x.UserId1 == request.UserId || x.UserId2 == request.UserId, cancellationToken: cancellationToken);
                var postCount = await database.Posts.CountAsync(x => x.UploaderId == request.UserId, cancellationToken: cancellationToken);
                var isFriend = request.UserId == request.RequestFrom || await database.Relationships.AnyAsync(x =>
                    (x.UserId1 == request.RequestFrom && x.UserId2 == request.UserId) ||
                    (x.UserId2 == request.RequestFrom && x.UserId1 == request.UserId), cancellationToken: cancellationToken);

                friendStatus = await GetFriendStatus(request, cancellationToken, isFriend);

                if (result != null)
                {
                    return new UserSummaryModel()
                    {
                        Id = result.Id,
                        Name = result.Name,
                        Email = result.Email,
                        ProfilePictureUrl = result.ProfilePictureUrl,
                        FriendStatus = friendStatus,
                        NumberOfFriends = friendsCount,
                        NumberOfPosts = postCount,
                    };

                }

                return null;
            }

            private async Task<int> GetFriendStatus(GetUserByIdQuery request, CancellationToken cancellationToken, bool isFriend)
            {
                int friendStatus;
                if (isFriend)
                {
                    friendStatus = 1;
                }
                else
                {
                    var isFriendRequestSent = await database.FriendRequests.AnyAsync(x =>
                        x.FromId == request.RequestFrom && x.ToId == request.UserId, cancellationToken: cancellationToken);
                    if (isFriendRequestSent)
                    {
                        friendStatus = 2;
                    }
                    else
                    {
                        var isFriendRequestPending = await database.FriendRequests.AnyAsync(x =>
                            x.ToId == request.RequestFrom && x.FromId == request.UserId, cancellationToken: cancellationToken);

                        friendStatus = isFriendRequestPending ? 3 : 0;
                    }
                }

                return friendStatus;
            }
        }
    }
}
