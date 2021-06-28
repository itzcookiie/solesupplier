import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/', (req,res) => {
    const inStockRetailers = req.body.retailers.filter(retailer => retailer.isInStock);
    const retailPrices = inStockRetailers.map(retailer => retailer.retailPrice);
    const lowestPrice = Math.min(...retailPrices);
    const retailersWithLowestPrice = inStockRetailers.filter(retailer => retailer.retailPrice === lowestPrice);
    const lowToHighPrices = retailersWithLowestPrice.sort((a,b) => a.retailPrice - b.retailPrice || a.discountPrice - b.discountPrice);
    const cheapestRetailer = lowToHighPrices[0];

    if(cheapestRetailer.discountPrice && cheapestRetailer.retailPrice - cheapestRetailer.discountPrice >= 10) {
        res.send({
            "alertRequired": true,
            "newPrice": cheapestRetailer.discountPrice,
            "productId": req.body.productId,
            "retailerId": cheapestRetailer.retailerId
        }).status(200);
    } else {
        res.send({"alertRequired": false}).status(400);
    }
})

app.listen(3000, () => console.log('App listening on port 3000!'))