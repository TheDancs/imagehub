using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Application.User.Queries.GetUser;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.User.Queries.SearchUsersByName
{
    public class SearchByNameRequest : IRequest<IEnumerable<UserSearchResult>>
    {
        public string Name { get; }
        public string FromUserId { get; }

        public SearchByNameRequest(string name, string fromUserId)
        {
            Name = name;
            FromUserId = fromUserId;
        }

        public class Handler : IRequestHandler<SearchByNameRequest, IEnumerable<UserSearchResult>>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<IEnumerable<UserSearchResult>> Handle(SearchByNameRequest request, CancellationToken cancellationToken)
            {
                var result = await database.Users.Where(x => x.Name.Contains(request.Name))
                    .Select(x => new UserSearchResult()
                    { Id = x.Id, Name = x.Name, ProfilePictureUrl = x.ProfilePictureUrl})
                    .ToListAsync(cancellationToken: cancellationToken);
                foreach (var searchResult in result)
                {
                    searchResult.FriendStatus =
                        await GetFriendStatus((request.FromUserId, searchResult.Id), cancellationToken);
                }

                return result;
            }

            private async Task<int> GetFriendStatus((string fromId, string toId) request, CancellationToken cancellationToken)
            {
                int friendStatus;
                if (request.fromId == request.toId)
                {
                    friendStatus = 1;
                }
                else
                {
                    var isFriendRequestSent = await database.FriendRequests.AnyAsync(x =>
                        x.FromId == request.fromId && x.ToId == request.toId, cancellationToken: cancellationToken);
                    if (isFriendRequestSent)
                    {
                        friendStatus = 2;
                    }
                    else
                    {
                        var isFriendRequestPending = await database.FriendRequests.AnyAsync(x =>
                            x.ToId == request.fromId && x.FromId == request.toId, cancellationToken: cancellationToken);

                        friendStatus = isFriendRequestPending ? 3 : 0;
                    }
                }

                return friendStatus;
            }
        }
    }
}
