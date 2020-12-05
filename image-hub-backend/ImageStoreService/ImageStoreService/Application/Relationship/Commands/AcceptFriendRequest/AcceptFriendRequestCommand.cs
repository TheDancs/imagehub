using System;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Domain.Entities;
using ImageHubService.Infrastructure.Repositories;
using MediatR;

namespace ImageHubService.Application.Relationship.Commands.AcceptFriendRequest
{
    public class AcceptFriendRequestCommand : IRequest<bool>
    {
        public string UserId { get; }
        public string RequestId { get; }

        public AcceptFriendRequestCommand(string requestId, string userId)
        {
            UserId = userId;
            RequestId = requestId;
        }

        public class Handler : IRequestHandler<AcceptFriendRequestCommand, bool>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<bool> Handle(AcceptFriendRequestCommand request, CancellationToken cancellationToken)
            {
                var friendRequest = await database.FriendRequests.FindAsync(Guid.Parse(request.RequestId));
                if (friendRequest != null)
                {
                    if (friendRequest.FromId == request.UserId || request.UserId == friendRequest.ToId)
                    {
                        await database.Relationships.AddAsync(new UserRelationship()
                            {UserId1 = friendRequest.FromId, UserId2 = friendRequest.ToId}, cancellationToken);
                    
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
