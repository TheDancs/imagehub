using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Domain.Repositories;
using ImageHubService.Infrastructure.Repositories;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace ImageHubService.Application.Post.Commands.UploadPost
{
    public class UploadPostCommand : IRequest<(bool success, string id)>
    {
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public string UploaderId { get; set; }

        public UploadPostCommand(IFormFile file, string description, string uploaderId)
        {
            File = file;
            Description = description;
            UploaderId = uploaderId;
        }

        public class Handler : IRequestHandler<UploadPostCommand, (bool success, string id)>
        {
            private readonly IPictureRepo imageRepository;
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database, IPictureRepo imageRepository)
            {
                this.database = database;
                this.imageRepository = imageRepository;
            }

            public async Task<(bool success, string id)> Handle(UploadPostCommand request, CancellationToken cancellationToken)
            {
                var imageId = Guid.NewGuid();
                var result = await imageRepository.UploadImage(imageId.ToString(), request.File.OpenReadStream(),
                    request.File.ContentType);
                if (result)
                {
                    await database.Posts.AddAsync(new Domain.Entities.Post()
                    {
                        Description = request.Description,
                        PictureId = imageId,
                        UploadTime = DateTime.UtcNow,
                        UploaderId = request.UploaderId
                    }, cancellationToken);

                    await database.SaveChangesAsync(cancellationToken);

                    return (true, imageId.ToString());
                }

                return (false, null);
            }
        }
    }
}
