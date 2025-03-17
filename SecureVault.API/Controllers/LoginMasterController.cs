using Microsoft.AspNetCore.Mvc;
using SecureVault.API.DBModels;
using SecureVault.API.Repository;

namespace SecureVault.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginMasterController : ControllerBase
    {
        private readonly ILogger<LoginMasterController> _logger;
        private readonly ILoginMasterRepository _loginMasterRepository;

        public LoginMasterController(ILogger<LoginMasterController> logger,
            ILoginMasterRepository loginMasterRepository)
        {
            _logger = logger;
            _loginMasterRepository = loginMasterRepository;
        }

        /// <summary>
        /// Read all LoginMaster from table.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<List<LoginMaster>> Get()
        {
            return await _loginMasterRepository.GetAllLoginMasters();
        }

        /// <summary>
        /// Read LoginMaster from table.
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetLoginMaster")]
        public async Task<LoginMaster> GetRow(long loginMasterId, int pageIndex, int pageSize)
        {
            return await _loginMasterRepository.GetQuery(loginMasterId, pageIndex, pageSize);
        }

        /// <summary>
        /// Read list of LoginMaster from table.
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetLoginMasterWithPagging")]
        public async Task<List<LoginMaster>> GetloginMasterWithPagging(int pageIndex, int pageSize)
        {
            var result = await _loginMasterRepository.GetQuery(pageIndex, pageSize);
            return result;
        }

        /// <summary>
        /// Create LoginMaster.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<LoginMaster> Post(LoginMaster loginMaster)
        {
            return await _loginMasterRepository.AddLoginMasterAsync(loginMaster);
        }

        /// <summary>
        /// Update LoginMaster.
        /// </summary>
        /// <returns></returns>
        [HttpPut]
        public async Task<LoginMaster> Put(LoginMaster loginMaster)
        {
            return await _loginMasterRepository.UpdateLoginMasterAsync(loginMaster);
        }

        /// <summary>
        /// Delete LoginMaster.
        /// </summary>
        /// <returns></returns>
        [HttpDelete]
        public async Task<bool> Delete(long loginMasterId)
        {
            return await _loginMasterRepository.DeleteLoginMasterAsync(loginMasterId);
        }
    }
}
