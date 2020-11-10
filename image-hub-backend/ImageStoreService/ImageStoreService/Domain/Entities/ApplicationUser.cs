using Microsoft.AspNetCore.Identity;

namespace ImageHubService.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FacebookUserId { get; set; }
        public string ProfilePicture { get; set; }
    }
}