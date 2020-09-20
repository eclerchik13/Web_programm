
function DayOff(year_,month_,date_)
{
    let result_ = false
    let day = new Date(year_,month_,date_)
    let number_ = day.getDay()
    if  (number_== 0 || number_ == 6)
    {
        result_ = true
    }
    return (result_)
}

//console.log(DayOff(2020,8,19))