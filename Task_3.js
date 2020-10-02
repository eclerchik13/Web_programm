function DayOff(year_,month_,date_)
{
    let result_ = false
    if (month_ > 12  || month_ < 0 || date_ < 1 || date_ > 31)
    {
        //throw new Error('403_WrongValue')
        next(new Error('403_WrongValue'))
    }
    let day = new Date(year_,month_,date_)
    let number_ = day.getDay()
    if  (number_== 0 || number_ == 6)
    {
        result_ = true
    }
    return (result_)
}

exports.DayOff = DayOff