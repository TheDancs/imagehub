using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.User.Queries.SearchUsersByName
{
    public class SearchByNameRequest : IRequest<IEnumerable<UserMetaModel>>
    {
        public string Name { get; }
        public string FromUserId { get; }

        public SearchByNameRequest(string name, string fromUserId)
        {
            Name = name;
            FromUserId = fromUserId;
        }

        public class Handler: IRequestHandler<SearchByNameRequest, IEnumerable<UserMetaModel>>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<IEnumerable<UserMetaModel>> Handle(SearchByNameRequest request, CancellationToken cancellationToken)
            {
                return await database.Users.Where(x => x.Name.Contains(request.Name))
                    .Select(x => new UserMetaModel()
                        {Id = x.Id, Name = x.Name, ProfilePictureUrl = x.ProfilePictureUrl})
                    .ToListAsync(cancellationToken: cancellationToken);
            }
        }
    }
}
