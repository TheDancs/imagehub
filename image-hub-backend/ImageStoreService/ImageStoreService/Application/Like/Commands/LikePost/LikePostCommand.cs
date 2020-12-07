using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.Like.Commands.LikePost
{
    public class LikePostCommand : IRequest<bool>
    {
        public string UserId { get; }
        public string PostId { get; }

        public LikePostCommand(string userId, string postId)
        {
            UserId = userId;
            PostId = postId;
        }

        public class Handler : IRequestHandler<LikePostCommand, bool>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<bool> Handle(LikePostCommand request, CancellationToken cancellationToken)
            {
                if (Guid.TryParse(request.PostId, out var postId) &&
                !await database.Likes.AnyAsync(x => x.PostId == postId && x.UserId == request.UserId, cancellationToken: cancellationToken))
                {
                    await database.Likes.AddAsync(new Domain.Entities.Like()
                    { PostId = postId, UserId = request.UserId }, cancellationToken);
                    await database.SaveChangesAsync(cancellationToken);

                    return true;
                }

                return false;
            }
        }
    }
}
