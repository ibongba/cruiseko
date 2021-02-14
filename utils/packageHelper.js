const price_list = [
  {customer_type :'adult',name : "Adult's Price", price :null,deposit_rate:0,commission_rate: 0,deposit:0,commission:0},
  {customer_type :'children',name : "Children's Price", price :null,deposit_rate:0,commission_rate: 0,deposit:0,commission:0}
]



export const errors = {
  MIN_HOUR_BOAT : 'MIN_HOUR_BOAT'
}
const initStateTypeNormal = {
    start_date:null,end_date : null,
    pricing_type : 'normal',
    user_type : [ {name : 'FIT',company_type_id : 0  ,price_list }  ]
}

const initFirstTier = {number : 2,price :null,deposit_rate:0,commission_rate: 0,deposit:0,commission:0}

const initStateTypeTier = {
    start_date:null,end_date : null,
    pricing_type : 'tier',
    user_type : [ {name : 'FIT',company_type_id : 0 , tier_start : 1 , tiers : [initFirstTier] }  ]
  
}

export const toPriceListState = (price_dates) => {
  return price_dates.map(val => {
    var {pricing_type} = val;
    

    var user_type = val.price_company_types.map(price_com => {
      const {company_type_id} = price_com
      
      var detail = [];
      if(pricing_type === 'tier'){
        detail = price_com.price_date_details.map(item => ({...item,number:item.range_end}) )
        if(!price_com.price_date_details.length) detail = [initFirstTier]
      }
      else{
        detail = price_com.price_date_details.map(item => ({...item,name : item.customer_type}) )
        if(!price_com.price_date_details.length) detail = price_list
      }
      var prep = {
        ...price_com,
        name : company_type_id === 0 ? 'FIT' : price_com.company_type.name,
        tier_start : pricing_type === 'tier' ? detail[0] ? detail[0].range_start : 1 : undefined 
      }
      prep[pricing_type === 'tier' ? 'tiers' : 'price_list'] = detail;

      return prep
    })

    var root = {
      start_date : val.start_date,
      end_date : val.end_date,
      pricing_type : val.pricing_type,
      user_type,
      cost : val.cost,
    }

    return root;

  })
}


export const sortImages = (images,order) =>{
  if(!order) return;
  images.sort((a,b) =>{
    var a = order.findIndex(val => val.id === a.id )
    var b = order.findIndex(val => val.id === b.id )
    return a-b
  })
}

export const calPackagePriceCard =(pkg,user,total_person=1)=>{
  var result = {price : -1 ,unit : 'person'}
  if(!pkg ) return result;
  if(!pkg.price_dates.length) return result;

  const {is_boat,products_boats} = pkg;
  if(!products_boats.length) return result;
  const {boat} = products_boats[0];
  var price_date = pkg.price_dates[0]
  var {pricing_type} = price_date;
  // console.log('pkg.price_dates',pkg.price_dates)

  var user_type = !user ? 'fit' : user.type 

  var company_type_id = 0
  if(user && user.company_type_id) company_type_id = user.company_type_id;

  var com_type = price_date.price_company_types.find(val => val.company_type_id == company_type_id)
    // console.log('com_type',com_type)
  if(!com_type) return result;

  if(pricing_type === 'normal'){
    var price_date_detail = com_type.price_date_details.find(val => val.customer_type === 'adult')
  
    if(price_date_detail){
      const {commission,price} = price_date_detail;
      const real_price = parseFloat(commission) || parseFloat(price)
      result.price = real_price
    }
      
    // return price_date_detail ? price_date_detail.price : result;
  }
  else{

    if(is_boat == 0){
      var price_date_detail = com_type.price_date_details.reduce((maxItem ,current) =>{
        if(!maxItem) return current;
        if(current.range_end >= maxItem.range_end) return current;
        else return maxItem
      })
  
      if(!price_date_detail) return result;
  
      const {commission,range_end,price} = price_date_detail;
      var net_price = parseFloat(commission)
      var normal_price = parseFloat(price)
      result.price =  user_type === 'fit' && net_price ? net_price/range_end : parseInt(normal_price / range_end) 
    }
    else{
      var price_date_detail = com_type.price_date_details[0]
      if(!price_date_detail) return result;
  
      const {commission,range_end,price} = price_date_detail;
      var net_price = parseFloat(commission)
      var normal_price = parseFloat(price)
      const real_price = parseFloat(commission) || parseFloat(price)
      const boat_amt = Math.ceil(total_person / boat.capacity) 
      result.price =  real_price*boat_amt
      result.normal_price = normal_price;
      result.unit = 'hour'
      result.boat_amt = boat_amt;
    }
    

    
    
  }

  return result;
  

}

export const calPackagePrice =(pkg,user,date,adult,children,duration)=>{
  var result = {price : -1 ,unit : 'person',error : null,error_payload : {}}
  if(!pkg ) return result;
  if(!pkg.price_dates.length) return result;

  const {is_boat,products_boats} = pkg;
  if(!products_boats.length) return result;
  const {boat} = products_boats[0];

  var total_person = adult+children;
  if(!total_person) total_person = 1;

  var price_date = pkg.price_dates.find(val => new Date(date) >= new Date(val.start_date) && new Date(date) <= new Date(val.end_date) )

  if(!price_date) return result;

  var {pricing_type} = price_date;
  // console.log('pkg.price_dates',pkg.price_dates)

  // var user_type = !user ? 'fit' : user.type 

  var company_type_id = 0
  if(user && user.company_type_id) company_type_id = user.company_type_id;

  var com_type = price_date.price_company_types.find(val => val.company_type_id == company_type_id)
    // console.log('com_type',com_type)
  if(!com_type) return result;

  if(pricing_type === 'normal'){
    var adult_detail = com_type.price_date_details.find(val => val.customer_type === 'adult')
    var children_detail = com_type.price_date_details.find(val => val.customer_type === 'children')

    
    if(adult_detail){
      const {commission,price} = adult_detail;
      const real_price = parseFloat(commission) || parseFloat(price)
      result.price = real_price  * adult 
    }
      
    if(children_detail){
      const {commission,price} = children_detail;
      const real_price = parseFloat(commission) || parseFloat(price)
      // console.log(real_price * children)
      if(!result.price) result.price = 0
      result.price += real_price * children 
    }
  }
  else{
    //1 <= 2 && 2 <= 
    var price_date_detail = com_type.price_date_details.find(val => val.range_start <= total_person && total_person <= val.range_end)

    if(!price_date_detail) return result;

    const {commission,price} = price_date_detail;
    var net_price = parseFloat(commission)
    // console.log('price_date_detail',total_person,price_date_detail)

    var normal_price = parseFloat(price) 
    const real_price = parseFloat(commission) || parseFloat(price)
    const boat_amt = Math.ceil(total_person / boat.capacity) 
    result.normal_price = normal_price
    result.boat_amt = boat_amt;
    if(is_boat == 0){
      result.price =  real_price
      result.per_person = real_price/total_person
    }
    else{
      const min_hour = Math.ceil(boat.min_hr / 60) 
      if(duration < min_hour) return {...result,error : errors.MIN_HOUR_BOAT,error_payload: {min_hour }};
      result.price =  real_price*boat_amt*parseInt(duration)
      result.unit = 'boat'
      
    }

    
    
    
  }

  return result;
  

}

export const calDuration = (start_time,end_time)=>{
  var [hour_start,min_start] = start_time.split(':')
  var [hour_end,min_end] = end_time.split(':')
  if(hour_end == 0) hour_end = parseInt(hour_end) + 24
  return  Math.abs((parseInt(hour_end)*60 +  parseInt(min_end)) - (parseInt(hour_start)*60 +  parseInt(min_start)))  / 60
}

export const isCancel = (booking) =>{
  if(!booking) return true;


  const start_date = new Date(booking.start_date)
  const now = new Date();
  if(now >= start_date) return true;

  return false

}