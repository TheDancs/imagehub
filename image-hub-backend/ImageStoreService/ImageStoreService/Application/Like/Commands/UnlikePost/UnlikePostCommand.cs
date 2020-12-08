using System;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.Like.Commands.UnlikePost
{
    public class UnlikePostCommand : IRequest<bool>
    {
        public string UserId { get; }
        public string PostId { get; }

        public UnlikePostCommand(string userId, string postId)
        {
            UserId = userId;
            PostId = postId;
        }

        public class Handler : IRequestHandler<UnlikePostCommand, bool>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<bool> Handle(UnlikePostCommand request, CancellationToken cancellationToken)
            {
                if (Guid.TryParse(request.PostId, out var postId))
                {
                    var result = await database.Likes.FirstOrDefaultAsync(x => x.PostId == postId && x.UserId == request.UserId, cancellationToken);
                    if (result != null)
                    {
                        database.Likes.Remove(result);
                        await database.SaveChangesAsync(cancellationToken);

                        return true;
                    }
                }

                return false;
            }
        }
    }
}
