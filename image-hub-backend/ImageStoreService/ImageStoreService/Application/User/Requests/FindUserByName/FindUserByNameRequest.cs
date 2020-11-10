using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Domain.Entities;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.User.Requests.FindUserByName
{
    public class FindUserByNameRequest : IRequest<IEnumerable<UserSearchResult>>
    {
        public string FromUserId { get; }
        public string Name { get; }

        public FindUserByNameRequest(string fromUserId, string name)
        {
            FromUserId = fromUserId;
            Name = name;
        }

        public class Handler : IRequestHandler<FindUserByNameRequest, IEnumerable<UserSearchResult>>
        {
            private readonly AppIdentityDbContext _database;
            private readonly IUserStore<ApplicationUser> userStore;

            public Handler(AppIdentityDbContext database, IUserStore<ApplicationUser> userStore)
            {
                _database = database;
                this.userStore = userStore;
            }

            public async Task<IEnumerable<UserSearchResult>> Handle(FindUserByNameRequest request, CancellationToken cancellationToken)
            {
                var user = await userStore.FindByIdAsync(request.FromUserId, cancellationToken).ConfigureAwait(false);
                if (user != null)
                {
                    var friends = await _database.Relationships
                        .Where(x => x.UserId1 == request.FromUserId || x.UserId2 == request.FromUserId).ToListAsync(cancellationToken: cancellationToken);
                    var searchResult = await _database.Users.Where(x => x.UserName.Contains(request.Name))
                        .ToListAsync(cancellationToken);

                    return searchResult.Select(x => new UserSearchResult()
                    {
                        IsFriend = friends.Any(y => y.UserId1 == x.Id || y.UserId2 == x.Id), Name = x.UserName,
                        ProfilePicture = x.ProfilePicture, UserId = x.Id
                    });
                }

                return new List<UserSearchResult>(); //TODO: send back meaning full result
            }
        }
    }
}
