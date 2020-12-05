using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.Relationship.Commands.RemoveFriend
{
    public class RemoveFriendCommand : IRequest<bool>
    {
        public string UserId { get; }

        public string FriendId { get; }

        public RemoveFriendCommand(string userId, string friendId)
        {
            UserId = userId;
            FriendId = friendId;
        }

        public class Handler : IRequestHandler<RemoveFriendCommand, bool>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<bool> Handle(RemoveFriendCommand request, CancellationToken cancellationToken)
            {
                var result = await database.Relationships.FirstOrDefaultAsync(x =>
                    (x.UserId1 == request.UserId && x.UserId2 == request.FriendId) ||
                    (x.UserId2 == request.UserId && x.UserId1 == request.FriendId), cancellationToken: cancellationToken);

                if (result != null)
                {
                    database.Relationships.Remove(result);
                    await database.SaveChangesAsync(cancellationToken);

                    return true;
                }

                return false;
            }
        }
    }
}
