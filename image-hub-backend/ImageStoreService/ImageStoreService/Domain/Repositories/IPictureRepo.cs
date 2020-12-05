using System.IO;
using System.Threading.Tasks;

namespace ImageHubService.Domain.Repositories
{
    public interface IPictureRepo
    {
        Task<(Stream iamgeStream, string contentType)> RetrieveImage(string imageId);
        Task<bool> UploadImage(string imageId, Stream imageStream, string contentType);
    }
}
