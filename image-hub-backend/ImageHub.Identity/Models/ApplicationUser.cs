using Microsoft.AspNetCore.Identity;

namespace ImageHub.Identity.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }
}
