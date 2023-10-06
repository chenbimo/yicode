/**
 * 省、市、区提取
 * @param {string} address 地址字符串
 * @returns {array} 省市区
 */
export function address_areaMatch(address) {
    let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
    let province = [];
    let addressBean = {
        province: '',
        region: '',
        city: ''
    };

    function regexAddressBean(address, addressBean) {
        regex = /^(.*?[市]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
        let addxress = regex.exec(address);
        addressBean.city = addxress?.[1];
        addressBean.region = addxress?.[2];
    }
    if (!(province = regex.exec(address))) {
        regex = /^(.*?(省|自治区))(.*?)$/;
        province = regex.exec(address);
        addressBean.province = province?.[1];
        regexAddressBean(province?.[3], addressBean);
    } else {
        addressBean.province = province?.[1];
        regexAddressBean(address, addressBean);
    }
    return addressBean;
}
