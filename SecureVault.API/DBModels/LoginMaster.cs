using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BaseClassLibrary.Models;

namespace SecureVault.API.DBModels
{
    public class LoginMaster : BaseModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Pin { get; set; }
        public bool IsExpired { get; set; }
    }
}
