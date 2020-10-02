
function CamelRegister(par1)
{
    let NewArr = par1.split(" ");
    let NewString = "";
    for (let i = 0; i < NewArr.length ; i++ )
    {
        NewString = NewString + ((NewArr[i])[0].toUpperCase())
        for (let j = 1; j < NewArr[i].length ; j++)
        {
            NewString = NewString + ((NewArr[i])[j].toLowerCase())
        }
    }
    return NewString
}
module.exports.CamelRegister = CamelRegister