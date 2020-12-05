using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ImageHubService.Domain.Repositories;

namespace ImageHubService.Infrastructure.Repositories
{
    public class BlobImageRepository : IPictureRepo
    {
        private readonly BlobContainerClient containerClient;

        public BlobImageRepository(string connectionString, string containerName)
        {
            var blobServiceClient = new BlobServiceClient(connectionString);
            containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        }

        public async Task<(Stream iamgeStream, string contentType)> RetrieveImage(string imageId)
        {
            var blobClient = containerClient.GetBlobClient(imageId);
            var download = await blobClient.DownloadAsync();

            return (download.Value.Content, download.Value.ContentType);
        }

        public async Task<bool> UploadImage(string imageId, Stream imageStream, string contentType)
        {
            var blobClient = containerClient.GetBlobClient(imageId);

            try
            {

                var result = await blobClient.UploadAsync(imageStream, new BlobHttpHeaders() { ContentType = contentType }, conditions: null);
                imageStream.Close();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
