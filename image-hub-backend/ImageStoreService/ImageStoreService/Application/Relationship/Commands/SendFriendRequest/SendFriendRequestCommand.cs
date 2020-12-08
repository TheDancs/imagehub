using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Domain.Entities;
using ImageHubService.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.Relationship.Commands.SendFriendRequest
{
    public class SendFriendRequestCommand : IRequest<bool>
    {
        public string FromUser { get; }
        public string ToUser { get; }

        public SendFriendRequestCommand(string fromUser, string toUser)
        {
            FromUser = fromUser;
            ToUser = toUser;
        }

        public class Handler : IRequestHandler<SendFriendRequestCommand, bool>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<bool> Handle(SendFriendRequestCommand request, CancellationToken cancellationToken)
            {
                if (request.FromUser != request.ToUser)
                {
                    var exists = await database.Relationships.AnyAsync(x =>
                        (x.UserId1 == request.FromUser && x.UserId2 == request.ToUser) ||
                        x.UserId1 == request.ToUser && x.UserId2 == request.FromUser, cancellationToken: cancellationToken);
                    var requested = await database.FriendRequests.AnyAsync(x =>
                        (x.FromId == request.FromUser && x.ToId == request.ToUser) ||
                        (x.FromId == request.ToUser && x.ToId == request.FromUser), cancellationToken: cancellationToken);

                    if (!exists && !requested)
                    {
                        await database.FriendRequests.AddAsync(new FriendRequest()
                        { Created = DateTime.UtcNow, FromId = request.FromUser, ToId = request.ToUser }, cancellationToken);

                        await database.SaveChangesAsync(cancellationToken);

                        return true;
                    }

                }

                return false;
            }
        }
    }
}
