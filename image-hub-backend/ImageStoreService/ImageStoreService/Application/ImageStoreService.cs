using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ImageHubService.Domain.Entities;
using ImageHubService.Domain.Repositories;
using ImageHubService.V1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ImageHubService.Application
{
    public class ImageStoreService : IImageStoreService
    {
        private readonly ILogger<ImageStoreService> logger;
        private readonly IImageRepository imageRepository;
        private readonly IConfiguration configuration;

        public ImageStoreService(ILogger<ImageStoreService> logger, IImageRepository imageRepository, IConfiguration configuration)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.imageRepository = imageRepository ?? throw new ArgumentNullException(nameof(imageRepository));
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<(bool success, string id)> UploadImage(ImageInputModel inputModel)
        {
            if (inputModel.File.Length > 0 && !string.IsNullOrEmpty(inputModel.UploaderId))
            {
                var id = await imageRepository.Add(ConvertToEntity(inputModel));

                return (true, id);
            }

            logger.LogInformation($"ImageStoreService: No attachment found");

            return (false, null);
        }

        public async Task<bool> Delete(string imageId)
        {
            if (await imageRepository.Contains(imageId))
            {
                await imageRepository.Remove(imageId);
                return true;
            }

            logger.LogCritical($"ImageStoreService: Remove failed: No image found with id: {imageId}");

            return false;

        }

        public async Task<ImageMetaModel> GetImage(string imageId)
        {
            var image = await imageRepository.Get(imageId);
            if (image == null)
            {
                logger.LogInformation($"ImageStoreService: Image not found with id: {imageId}");

                return null;
            }

            return ConvertToModel(image);
        }

        public async Task<IEnumerable<ImageMetaModel>> ListImages()
        {
            var images = await imageRepository.List();

            return images.Select(ConvertToModel);
        }


        public async Task<bool> UpdateImage(string imageId, ImageUpdateModel updateModel)
        {
            if (await imageRepository.Contains(imageId))
            {
                var image = await imageRepository.Get(imageId);

                image.Title = updateModel.Title;
                image.Description = updateModel.Description;

                await imageRepository.Update(image);

                return true;
            }

            logger.LogCritical($"ImageStoreService: Update image failed: no image found with id {imageId}");

            return false;
        }

        public async Task<(bool result, byte[] bytes, string contentType, string fileName)> GetImageContent(string id)
        {
            var image = await imageRepository.Get(id);

            if (image != null)
            {
                return (true, Convert.FromBase64String(image.ImageBase64), image.ContentType, image.FileName);
            }

            return (false, null, null, null);
        }

        private ImageMetaModel ConvertToModel(ImageEntity imageEntity)
        {
            return new ImageMetaModel()
            {
                Description = imageEntity.Description,
                Id = imageEntity.Id,
                PictureUrl = $"{configuration.GetValue<string>("Application:BaseUrl")}/api/v1.0/content/{imageEntity.Id}",
                Title = imageEntity.Title,
                Uploader = imageEntity.UploaderId
            };
        }

        private ImageEntity ConvertToEntity(ImageInputModel inputModel, string id = null)
        {
            return new ImageEntity()
            {
                Description = inputModel.Description,
                Id = id,
                ImageBase64 = ConvertToBase64(inputModel.File),
                Title = inputModel.Title,
                UploaderId = inputModel.UploaderId,
                ContentType = inputModel.File.ContentType,
                FileName = AddFileExtension(inputModel.File.FileName, inputModel.File.ContentType)
            };
        }

        private string ConvertToBase64(IFormFile file)
        {
            using var mStream = new MemoryStream();
            file.CopyTo(mStream);
            var fileBytes = mStream.ToArray();
            return Convert.ToBase64String(fileBytes);
        }

        //private byte[] ConvertToStream(string base64Image)
        //{
        //    var bytes = ;
        //    using var memoryStream = new MemoryStream(bytes);
        //    return new StreamContent(memoryStream);
        //}

        private static string AddFileExtension(string name, string contentType)
        {
            if (contentType == "application/octet-stream") return name;
            var nameParts = name.Split(".");
            if (nameParts.Length > 2)
            {

                return name + nameParts[1];
            }

            return name;
        }
        
    }
}
