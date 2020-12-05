using System;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using MediatR;

namespace ImageHubService.Application.Relationship.Commands.RejectFriendRequest
{
    public class RejectFriendRequestCommand : IRequest<bool>
    {
        public string UserId { get; }
        public string RequestId { get; }

        public RejectFriendRequestCommand(string requestId, string userId)
        {
            UserId = userId;
            RequestId = requestId;
        }

        public class Handler : IRequestHandler<RejectFriendRequestCommand, bool>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<bool> Handle(RejectFriendRequestCommand request, CancellationToken cancellationToken)
            {
                var friendRequest = await database.FriendRequests.FindAsync(Guid.Parse(request.RequestId));
                if (friendRequest != null)
                {
                    if (friendRequest.FromId == request.UserId || request.UserId == friendRequest.ToId)
                    {
                        database.FriendRequests.Remove(friendRequest);

                        await database.SaveChangesAsync(cancellationToken);

                        return true;
                    }
                }

                return false;
            }
        }
    }
}
