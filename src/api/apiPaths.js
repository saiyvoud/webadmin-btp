const baseUrl = "https://scholarship-api-0oe7.onrender.com/api/v1"
// const baseUrl = "http://localhost:8000/api/v1"

export default class ApiPath {
    // about
    static addAbout = `${baseUrl}/about/insert`
    static getAbout = `${baseUrl}/about/selAll`
    static getAboutOne = `${baseUrl}/about/selOne`
    static delAbout = `${baseUrl}/about/delete`
    static updateAbout = `${baseUrl}/about/update`
    static updateAboutImg = `${baseUrl}/about/updateImages`
    static addCoverImage = `${baseUrl}/coverImage/insert`
    static updateCoverImage = `${baseUrl}/coverImage/updateImage`
    static addCoverImage = `${baseUrl}/coverImage/insert`
    static getCoverImage = `${baseUrl}/coverImage/selAll`

    static addCompanyData = `${baseUrl}/companyData/insert`
    static getCompanyData = `${baseUrl}/companyData/selAll`
    static updateCompanyData = `${baseUrl}/companyData/update`
    static updateIconCompanyData = `${baseUrl}/companyData/updateIcon`

    // category
    static getCategory = `${baseUrl}/category/selAll`
    static addCategory = `${baseUrl}/category/insert`
    static deleteCategory = `${baseUrl}/category/delete`
    static updateCategory = `${baseUrl}/category/update`

    // service
    static getService = `${baseUrl}/services/selAll`
    static getOneService = `${baseUrl}/services/selOne`
    static deleteSetvice = `${baseUrl}/services/delete`
    static addService = `${baseUrl}/services/insert`
    static updateService = `${baseUrl}/services/update`
    static updateServiceImage = `${baseUrl}/services/updateImage`
    static updateServiceFile = `${baseUrl}/services/updateFile`

    // news
    static getNews = `${baseUrl}/news/selAll`
    static getOneNews = `${baseUrl}/news/selOne`
    static addNews = `${baseUrl}/news/insert`
    static delNews = `${baseUrl}/news/delete`
    static updateNews = `${baseUrl}/news/update`
    static updateNewsImage = `${baseUrl}/news/updateImage`
    static updateNewsFile = `${baseUrl}/news/updateFile`

    // banner
    static getBanner = `${baseUrl}/banner/selAll`
    static getBannerOne = `${baseUrl}/banner/selOne`
    static delBanner = `${baseUrl}/banner/delete`
    static addBanner = `${baseUrl}/banner/insert`
    static updateImageBanner = `${baseUrl}/banner/updateImage`
    static updateFileBanner = `${baseUrl}/banner/updateFile`
    static updateBanner = `${baseUrl}/banner/update`
    static updateSwitchBanner = `${baseUrl}/banner/updateIsPublished`

    // contact
    static getContact = `${baseUrl}/comment/selAll`
    static deleteContact = `${baseUrl}/comment/delete`

    // user
    static getUser = `${baseUrl}/user/selAll`
    static getUserOne = `${baseUrl}/user/selOne`
    static updateUser = `${baseUrl}/user/update`
    static updateUserImage = `${baseUrl}/user/updateImage`
    static deleteUser = `${baseUrl}/user/delete`
    static register = `${baseUrl}/user/registor`
    static login = `${baseUrl}/user/login`


    // view
    static getView = `${baseUrl}/userView/selBymonth`
}