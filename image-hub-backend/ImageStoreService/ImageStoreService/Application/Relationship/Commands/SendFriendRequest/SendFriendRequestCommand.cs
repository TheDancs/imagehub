using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Domain.Entities;
using ImageHubService.Infrastructure.Repositories;
using MediatR;

namespace ImageHubService.Application.Relationship.Commands.SendFriendRequest
{
    public class SendFriendRequestCommand : IRequest
    {
        public string FromUser { get; }
        public string ToUser { get; }

        public SendFriendRequestCommand(string fromUser, string toUser)
        {
            FromUser = fromUser;
            ToUser = toUser;
        }

        public class Handler : IRequestHandler<SendFriendRequestCommand>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<Unit> Handle(SendFriendRequestCommand request, CancellationToken cancellationToken)
            {
                var exists = database.Relationships.Any(x =>
                    (x.UserId1 == request.FromUser && x.UserId2 == request.ToUser) ||
                    x.UserId1 == request.ToUser && x.UserId2 == request.FromUser);

                if (!exists)
                {
                    await database.FriendRequests.AddAsync(new FriendRequest()
                    { Created = DateTime.UtcNow, FromId = request.FromUser, ToId = request.ToUser}, cancellationToken);

                    await database.SaveChangesAsync(cancellationToken);

                }

                return Unit.Value;
            }
        }
    }
}
