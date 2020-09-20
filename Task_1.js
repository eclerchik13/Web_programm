
function CamelRegister(par1)
{
    let NewArr = par1.split(" ");
    let NewString = "";
    for (let i = 0; i < NewArr.length ; i++ )
    {
        NewString = NewString + ((NewArr[i])[0].toUpperCase()) + NewArr[i].slice(1,NewArr[i].length + 1)
    }
    return(NewString)
}
