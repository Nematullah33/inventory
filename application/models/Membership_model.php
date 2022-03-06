<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Membership_model extends CI_Model {

	//Datatable start
	var $table = 'db_memberships as m';
	var $column_order = array('m.id','m.name','m.mobile','m.address','m.discount','m.status'); //set column field database for datatable orderable
	var $column_search = array('m.id','m.name','m.mobile','m.status'); //set column field database for datatable searchable 
	
	var $order = array('m.id' => 'desc'); // default order 

	public function __construct()
	{
		parent::__construct();
	}


	private function _get_datatables_query()
	{
		
		$this->db->select($this->column_order);
		$a=$this->db->from($this->table);
		
		$i = 0;
	
		foreach ($this->column_search as $item) // loop column 
		{
			
			if($_POST['search']['value']) // if datatable send POST for search
			{
				
				if($i===0) // first loop
				{
					$this->db->group_start(); // open bracket. query Where with OR clause better with bracket. because maybe can combine with other WHERE with AND.
					$this->db->like($item, $_POST['search']['value']);
				}
				else
				{
					$this->db->or_like($item, $_POST['search']['value']);
				}

				if(count($this->column_search) - 1 == $i) //last loop
					$this->db->group_end(); //close bracket
			}
			$i++;
		}
		
		if(isset($_POST['order'])) // here order processing
		{
			$this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
		} 
		else if(isset($this->order))
		{
			$order = $this->order;
			$this->db->order_by(key($order), $order[key($order)]);
		}
		
	}

	function get_datatables()
	{  
		
		$this->_get_datatables_query();
		if($_POST['length'] != -1)
		
		$this->db->limit($_POST['length'], $_POST['start']);
		$query = $this->db->get();
		return $query->result();
		
	}
	function get_membership()
	{
		$query=$this->db->query("select * from db_memberships");
		$a=$query->result();
		//echo json_encode($a);
		return json_encode($a);
	}


	function count_filtered()
	{
		$this->_get_datatables_query();
		$query = $this->db->get();
		return $query->num_rows();
	}

	public function count_all()
	{
		$this->db->from($this->table);
		return $this->db->count_all_results();
	}
	//Datatable end

	//Save Cutomers
	public function verify_and_save(){
		//Filtering XSS and html escape from user inputs 
		extract($this->security->xss_clean(html_escape(array_merge($this->data,$_POST))));

		$state = (!empty($state)) ? $state : 'NULL';

		//Validate This customers already exist or not
		/*$query=$this->db->query("select * from db_customers where upper(customer_name)=upper('$customer_name')");
		if($query->num_rows()>0){
			return "Sorry! This Customers Name already Exist.";
		}*/
		$query2=$this->db->query("select * from db_memberships where mobile='$mobile'");
		if($query2->num_rows()>0 && !empty($mobile)){
			return "Sorry!This Mobile Number already Exist.";;
		}
		
		$qs5="select customer_init from db_company";
		$q5=$this->db->query($qs5);
		$customer_init=$q5->row()->customer_init;

		//Create customers unique Number
		$qs4="select coalesce(max(id),0)+1 as maxid from db_customers";
		$q1=$this->db->query($qs4);
		//$maxid=$q1->row()->maxid;
		//$customer_code=$customer_init.str_pad($maxid, 4, '0', STR_PAD_LEFT);
		//end
		
		$query1="insert into db_memberships(name,mobile,address,
		discount,created_date,created_time,created_by,status)
											values('$member_name','$mobile',
											'$address','$discount',
											'$CUR_DATE','$CUR_TIME','$CUR_USERNAME',1)";

		if ($this->db->simple_query($query1)){
				$this->session->set_flashdata('success', 'Success!! New Member Added Successfully!');
		        return "success";
		}
		else{
		        return "failed";
		}
		
	}

	//Get customers_details
	public function get_details($id,$data){
		//Validate This customers already exist or not
		$query=$this->db->query("select * from db_memberships where upper(id)=upper('$id')");
		if($query->num_rows()==0){
			show_404();exit;
		}
		else{
			$query=$query->row();
			$data['q_id']=$query->id;
			$data['customer_name']=$query->member_name;
			$data['mobile']=$query->mobile;
			$data['address']=$query->address;
			$data['discount']=$query->discount;
			return $data;
		}
	}
	public function update_members(){
		//Filtering XSS and html escape from user inputs 
		extract($this->security->xss_clean(html_escape(array_merge($this->data,$_POST))));

		if($q_id==1){
			echo "Sorry! This Record Restricted! Can't Update";exit();
		}

		$state = (!empty($state)) ? $state : 'NULL';

			$query1="update db_memberships set name='$member_name',mobile='$mobile'
							address='$address',discount='$discount'
							 where id=$q_id";
			if ($this->db->simple_query($query1)){
					$this->session->set_flashdata('success', 'Success!! Customer Updated Successfully!');
			        return "success";
			}
			else{
			        return "failed";
			}
		
	}
	public function update_status($id,$status){

		if($id==1){
			echo "Sorry! This Record Restricted! Can't Update Status";exit();
		}

        $query1="update db_memberships set status='$status' where id=$id";
        if ($this->db->simple_query($query1)){
            echo "success";
        }
        else{
            echo "failed";
        }
	}

	public function delete_members_from_table($ids){
		if($ids==1){
			echo "Sorry! This Record Restricted! Can't Delete";exit();
		}
		$q1 = $this->db->query("select count(*) as tot_entrys from db_sales where customer_id in ($ids)");
		if($q1->row()->tot_entrys >0 ){
			echo "Sales Invoices Exist of Customer! Please Delete Sales Invoices!";exit();
		}
		$q1 = $this->db->query("delete from db_cobpayments where customer_id<>1 and customer_id in ($ids)");
		$query1="delete from db_customers where id in($ids) and id<>1";
        if ($this->db->simple_query($query1)){
            echo "success";
        }
        else{
            echo "failed";
        }	
	}





}
