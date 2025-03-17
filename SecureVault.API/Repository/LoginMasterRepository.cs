using BaseClassLibrary.Interface;
using SecureVault.API.DBContext;
using SecureVault.API.DBModels;
using System.Linq.Expressions;

namespace SecureVault.API.Repository
{
    public interface ILoginMasterRepository
    {
        Task<List<LoginMaster>> GetAllLoginMasters();
        Task<LoginMaster> AddLoginMasterAsync(LoginMaster loginMaster);
        Task<LoginMaster> UpdateLoginMasterAsync(LoginMaster loginMaster);
        Task<bool> DeleteLoginMasterAsync(long loginMasterId);
        Task<List<LoginMaster>> GetQuery(int pageIndex, int pageSize);
        Task<LoginMaster> GetQuery(long loginMasterId, int pageIndex, int pageSize);
    }
}

namespace SecureVault.API.Repository
{
    public class LoginMasterRepository : ILoginMasterRepository
    {
        private readonly IBaseRepository<LoginMaster, AppDbContext> _loginMasterRepo;

        public LoginMasterRepository(IBaseRepository<LoginMaster, AppDbContext> loginMasterRepo)
        {
            _loginMasterRepo = loginMasterRepo;
        }

        public async Task<LoginMaster> AddLoginMasterAsync(LoginMaster loginMaster)
        {
            try
            {
                await _loginMasterRepo.BeginTransactionAsync();

                var result = await _loginMasterRepo.AddAsync(loginMaster);

                await _loginMasterRepo.CommitTransactionAsync();

                return result;
            }
            catch (Exception)
            {
                await _loginMasterRepo.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<bool> DeleteLoginMasterAsync(long loginMasterId)
        {
            await _loginMasterRepo.DeleteAsync(loginMasterId);
            return true;
        }

        public async Task<List<LoginMaster>> GetAllLoginMasters()
        {
            Expression<Func<LoginMaster, bool>> predicate = c => c.ID > 0;

            return await _loginMasterRepo.GetAllAsync(predicate);
        }

        public async Task<List<LoginMaster>> GetQuery(int pageIndex, int pageSize)
        {
            return await _loginMasterRepo.QueryAsync(
                query => query.ID > 0,
                orderBy: c => c.CreatedDate ?? DateTime.Now,
                pageIndex, pageSize);
        }

        public async Task<LoginMaster> GetQuery(long loginMasterId, int pageIndex, int pageSize)
        {
            var result = await _loginMasterRepo.QueryAsync(
               query => query.ID == loginMasterId,
               orderBy: c => c.CreatedDate,
               pageIndex, pageSize);

            return result?.FirstOrDefault();
        }

        public async Task<LoginMaster> UpdateLoginMasterAsync(LoginMaster loginMaster)
        {
            await _loginMasterRepo.UpdateAsync(loginMaster);
            return loginMaster;
        }
    }
}
