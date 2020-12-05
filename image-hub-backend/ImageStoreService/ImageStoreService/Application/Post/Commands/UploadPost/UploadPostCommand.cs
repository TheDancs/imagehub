using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Domain.Repositories;
using ImageHubService.Infrastructure.Repositories;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;

namespace ImageHubService.Application.Post.Commands.UploadPost
{
    public class UploadPostCommand : IRequest<(bool success, string id, int errorCode)>
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

        public class Handler : IRequestHandler<UploadPostCommand, (bool success, string id, int errorCode)>
        {
            private readonly IPictureRepo imageRepository;
            private readonly AppIdentityDbContext database;
            private readonly IComputerVisionClient computerVisionClient;

            public Handler(AppIdentityDbContext database, IPictureRepo imageRepository, IComputerVisionClient computerVisionClient)
            {
                this.database = database;
                this.imageRepository = imageRepository;
                this.computerVisionClient = computerVisionClient;
            }

            public async Task<(bool success, string id, int errorCode)> Handle(UploadPostCommand request, CancellationToken cancellationToken)
            {
                var imageId = Guid.NewGuid();
                var result = await imageRepository.UploadImage(imageId.ToString(), request.File.OpenReadStream(),
                    request.File.ContentType);
                if (result)
                {
                    var tagResponse = await computerVisionClient.TagImageInStreamWithHttpMessagesAsync(request.File.OpenReadStream(), cancellationToken: cancellationToken);
                    if (!tagResponse.Body.Tags.Any(x => x.Name == "airplane" && x.Confidence > 0.7))
                    {
                        await database.Posts.AddAsync(new Domain.Entities.Post()
                        {
                            Description = request.Description,
                            PictureId = imageId,
                            UploadTime = DateTime.UtcNow,
                            UploaderId = request.UploaderId
                        }, cancellationToken);

                        await database.SaveChangesAsync(cancellationToken);

                        return (true, imageId.ToString(), -1);
                    }
                    //TODO: remove picture
                    return (false, null, 2);
                }

                return (false, null, 1);
            }
        }
    }
}
