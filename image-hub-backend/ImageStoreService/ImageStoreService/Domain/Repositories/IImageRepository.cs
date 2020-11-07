using System.Collections.Generic;
using System.Threading.Tasks;
using ImageHubService.Domain.Entities;

namespace ImageHubService.Domain.Repositories
{
    public interface IImageRepository
    {
        Task<string> Add(ImageEntity imageEntity);
        Task<bool> Contains(string imageId);
        Task Remove(string imageId);
        Task Update(ImageEntity imageEntity);
        Task<ImageEntity> Get(string imageId);
        Task<IEnumerable<ImageEntity>> List();
        Task<IEnumerable<ImageEntity>> GetUserImage(string userId);
    }
}
