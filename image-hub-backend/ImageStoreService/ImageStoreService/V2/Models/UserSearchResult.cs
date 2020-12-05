namespace ImageHubService.V2.Models
{
    public class UserSearchResult
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string ProfilePicture { get; set; }
        public bool IsFriend { get; set; }
    }
}
