using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ImageStoreService.V1.Models;

namespace ImageStoreService.Application
{
    public interface IImageStoreService
    {
        Task<(bool success, string id)> UploadImage(ImageInputModel inputModel);
        Task<bool> Delete(string imageId);
        Task<ImageMetaModel> GetImage(string imageId);
        Task<IEnumerable<ImageMetaModel>> ListImages();
        Task<bool> UpdateImage(string imageId, ImageUpdateModel updateModel);
        Task<(bool result, byte[] bytes, string contentType, string fileName)> GetImageContent(string id);
    }
}