using BaseClassLibrary;
using Microsoft.EntityFrameworkCore;
using SecureVault.API.DBModels;

namespace SecureVault.API.DBContext
{
    public class AppDbContext : GenericDbContext<AppDbContext>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Add DbSet properties for your entities
        public DbSet<LoginMaster> LoginMaster { get; set; }

        // You can override OnModelCreating if you need additional configurations
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Additional configurations for your entities
            
        }
    }
}
