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

            public Handler(AppIdentityDbContext database)
            {
                _database = database;
            }

            public async Task<UserModel> Handle(GetUserByIdCommand request, CancellationToken cancellationToken)
            {

                return null;
            }

            private UserMetaModel ConvertToUserMeta(UserRelationship x, string userId)
            {
                if (x.UserId1 != userId)
                {
                    return new UserMetaModel() { Id = x.UserId1, Name = "TODO" };
                }

                return new UserMetaModel() { Id = x.UserId2, Name = "TODO" };
            }
        }
    }
}
