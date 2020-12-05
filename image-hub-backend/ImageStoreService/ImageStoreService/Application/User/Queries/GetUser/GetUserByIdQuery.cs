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
    public class GetUserByIdQuery : IRequest<UserModel>
    {
        public string UserId { get; }
        public string RequestFrom { get; }

        public GetUserByIdQuery(string userId, string requestFrom)
        {
            UserId = userId;
            RequestFrom = requestFrom;
        }

        public class Handler : IRequestHandler<GetUserByIdQuery, UserModel>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<UserModel> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
            {
                var result = await database.Users
                    .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken: cancellationToken);


                if (result != null)
                {
                    return new UserModel()
                    {
                        Id = result.Id,
                        Name = result.Name,
                        Email = result.Email,
                        ProfilePictureUrl = result.ProfilePictureUrl
                    };

                }

                return null;
            }
        }
    }
}
