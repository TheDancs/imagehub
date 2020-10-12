using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImageStoreService.Domain.Entities;
using ImageStoreService.Domain.Repositories;

namespace ImageStoreService.Infrastructure.Repositories
{
    //TODO: thread safety
    public class InMemoryImageRepo : IImageRepository
    {
        private readonly ConcurrentDictionary<string, ImageEntity> store = new ConcurrentDictionary<string, ImageEntity>();

        public Task<string> Add(ImageEntity imageEntity)
        {
            imageEntity.Id = Guid.NewGuid().ToString();

            store.TryAdd(imageEntity.Id, imageEntity);

            return Task.FromResult(imageEntity.Id);
        }

        public Task<bool> Contains(string imageId)
        {
            return Task.FromResult(store.ContainsKey(imageId));
        }

        public Task Remove(string imageId)
        {
            store.TryRemove(imageId, out var image);

            return Task.CompletedTask;
        }

        public Task Update(ImageEntity imageEntity)
        {
            store[imageEntity.Id] = imageEntity;

            return Task.CompletedTask;
        }

        public Task<ImageEntity> Get(string imageId)
        {
            if (store.TryGetValue(imageId, out var image))
            {

                return Task.FromResult(image);
            }

            return Task.FromResult((ImageEntity)null);
        }

        public Task<IEnumerable<ImageEntity>> List()
        {
            return Task.FromResult(store.Select(x => x.Value));
        }

        public Task<IEnumerable<ImageEntity>> GetUserImage(string userId)
        {
            return Task.FromResult(store.Where(x => x.Value.UploaderId == userId).Select(x => x.Value));
        }
    }
}
