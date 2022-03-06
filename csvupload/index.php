<?php
//index.php
$connect = mysqli_connect("localhost", "bindusoft_bornali", "Dhaka#001", "bindusoft_bornali");
$message = '';

if(isset($_POST["upload"]))
{
 if($_FILES['product_file']['name'])
 {
  $filename = explode(".", $_FILES['product_file']['name']);
  if(end($filename) == "csv")
  {
   $handle = fopen($_FILES['product_file']['tmp_name'], "r");
   while($data = fgetcsv($handle))
   {
       
       
            $item_code=mysqli_real_escape_string($connect,$data[0]);
			$custom_barcode=mysqli_real_escape_string($connect,$data[1]);
			$item_name=mysqli_real_escape_string($connect,$data[2]);
			$sales_price=mysqli_real_escape_string($connect,$data[3]);
			
       
       
    //$product_id = mysqli_real_escape_string($connect, $data[0]);
    //$product_category = mysqli_real_escape_string($connect, $data[1]);  
      //          $product_name = mysqli_real_escape_string($connect, $data[2]);
    //$product_price = mysqli_real_escape_string($connect, $data[3]);
    
    	$query="INSERT INTO db_items (`item_code`, `custom_barcode`, `item_name`, `description`, `category_id`, `sku`, `hsn`, `unit_id`, `alert_qty`, `brand_id`, `lot_number`, `expire_date`, `price`, `tax_id`, `purchase_price`, `tax_type`, `profit_margin`, `sales_price`, `stock`, `item_image`, `system_ip`, `system_name`, `created_date`, `created_time`, `created_by`, `company_id`, `status`) 
			VALUES
('$item_code','$custom_barcode','$item_name','', 1, '', NULL, 9, 0, 0, '', NULL, 2.00, 3, 2.00, 'Inclusive', 2.00, '$sales_price', 4515.00, NULL, '103.17.69.207', '103.17.69.207', '2021-04-20', '01:30:05 pm', 'savar', NULL, 1);";
			
   
    mysqli_query($connect, $query);
   }
   fclose($handle);
   header("location: index.php?updation=1");
  }
  else
  {
   $message = '<label class="text-danger">Please Select CSV File only</label>';
  }
 }
 else
 {
  $message = '<label class="text-danger">Please Select File</label>';
 }
}

if(isset($_GET["updation"]))
{
 $message = '<label class="text-success">Product Updation Done</label>';
}

//$query = "SELECT * FROM daily_product";
//$result = mysqli_query($connect, $query);
?>
<!DOCTYPE html>
<html>
 <head>
  <title>Update Mysql Database through Upload CSV File using PHP</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
 </head>
 <body>
  <br />
  <div class="container">
   <h2 align="center">Update Mysql Database through Upload CSV File using PHP</a></h2>
   <br />
   <form method="post" enctype='multipart/form-data'>
    <p><label>Please Select File(Only CSV Formate)</label>
    <input type="file" name="product_file" /></p>
    <br />
    <input type="submit" name="upload" class="btn btn-info" value="Upload" />
   </form>
   <br />
   <?php echo $message; ?>
   
  </div>
 </body>
</html>