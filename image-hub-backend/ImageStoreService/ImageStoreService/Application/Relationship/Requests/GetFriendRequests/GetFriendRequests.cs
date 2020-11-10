using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.Relationship.Requests.GetFriendRequests
{
    public class GetFriendRequests : IRequest<IEnumerable<FriendRequest>>
    {
        public string UserId { get; }

        public GetFriendRequests(string userId)
        {
            UserId = userId;
        }

        public class Handler: IRequestHandler<GetFriendRequests, IEnumerable<FriendRequest>>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }


            public async Task<IEnumerable<FriendRequest>> Handle(GetFriendRequests request, CancellationToken cancellationToken)
            {
                return await database.FriendRequests.Where(x => x.To == request.UserId).Select(y => new FriendRequest()
                {
                    From = new UserMetaModel() {Id = y.FromUser.Id, Name = y.FromUser.UserName}, Id = y.Id.ToString(),
                    RequestTime = y.Created
                }).ToListAsync(cancellationToken);
            }
        }
    }
}
