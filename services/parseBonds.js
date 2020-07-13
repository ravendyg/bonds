const cheerio = require('cheerio');

const indices = {
    subfed: {
        time: 1,
        name: 2,
        paymentDate: 4,
        leftUntilPayed: 5,
        yield: 6,
        couponRate: 7,
        couponToPrice: 8,
        price: 9,
        volume: 10,
        coupon: 11,
        frequency: 12,
        accumulated: 13,
        duration: 14,
        couponDate: 15,
    },
    ofz: {
        time: 1,
        name: 2,
        paymentDate: 4,
        leftUntilPayed: 5,
        yield: 6,
        couponRate: 8,
        couponToPrice: 9,
        price: 10,
        volume: 11,
        coupon: 12,
        frequency: 13,
        accumulated: 14,
        duration: 15,
        couponDate: 16,
    },
    bonds: {
        time: 1,
        name: 2,
        paymentDate: 5,
        leftUntilPayed: 6,
        yield: 7,
        couponRate: 8,
        couponToPrice: 9,
        price: 10,
        volume: 11,
        coupon: 12,
        frequency: 13,
        accumulated: 14,
        duration: 15,
        couponDate: 16,
    },
};

module.exports = function parse(str, type) {
    const bonds = [];
    const positions = indices[type] || indices.subfed;

    try {
        const $ = cheerio.load(str);
        const trs = $('tr');
        trs.slice(1).each((index, node) => {
            const bond = [];
            const tds = node.children.filter(chd => chd.name === 'td');
            if (tds.length < 2) {
              return;
            }
            const leftUntilPayed = (tds[positions.leftUntilPayed].children[0] || { data: '' }).data;
            const couponRate = parseFloat((tds[positions.couponRate].children[0] || { data: '0' }).data);
            const price = (tds[positions.price].children[0] || { data: '' }).data;
            const couponToPrice = parseFloat((tds[positions.couponToPrice].children[0] || { data: '0' }).data);
            const _yield = parseFloat((tds[positions.yield].children[0] || { data: '0' }).data);
            const yieldWithoutReinvestment = (Math.round(
                (couponRate * parseFloat(leftUntilPayed) - (parseFloat(price) - 100))
                / parseFloat(price) / parseFloat(leftUntilPayed) * 100
                * 100) / 100) || '';

            bond.push((tds[positions.time].children[0] || { data: '' }).data);
            const nameWrapper = tds[positions.name].children[0];
            const { href } = nameWrapper.attribs;
            const name = nameWrapper.children[0].data;
            bond.push({ name, href: 'https://smart-lab.ru' + href });
            bond.push((tds[positions.paymentDate].children[0] || { data: '' }).data);
            bond.push(leftUntilPayed);
            bond.push(_yield);
            bond.push(yieldWithoutReinvestment);
            bond.push(couponRate);
            bond.push(couponToPrice);
            bond.push(price);
            bond.push((tds[positions.volume].children[0] || { data: '' }).data);
            bond.push((tds[positions.coupon].children[0] || { data: '' }).data);
            bond.push((tds[positions.frequency].children[0] || { data: '' }).data);
            bond.push((tds[positions.accumulated].children[0] || { data: '' }).data);
            bond.push((tds[positions.duration].children[0] || { data: '' }).data);
            bond.push((tds[positions.couponDate].children[0] || { data: '' }).data);
            const bcsLink = href.replace('/q/bonds', 'https://bcs-express.ru/kotirovki-i-grafiki');
            bond.push({ name: 'БКС', href: bcsLink });

            return bonds.push(bond);
        });

    } catch (err) {
        console.error(err);
    }

    return bonds;
}
