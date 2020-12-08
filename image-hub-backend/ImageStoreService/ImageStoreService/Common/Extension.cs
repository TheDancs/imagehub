using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.Common
{
    public static class Extension
    {
        public static string GetUserId(this Controller controller)
        {
            return controller.User.Claims.FirstOrDefault(x => x.Type == "sub")?.Value;
        }
    }
}
