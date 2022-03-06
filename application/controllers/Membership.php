<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Membership extends MY_Controller {
	public function __construct(){
		parent::__construct();
		$this->load_global();
		$this->load->model('Membership_model','membership');
	}


	public function index()
	{
		$this->permission_check('customers_view');
		$data=$this->data;
		$data['page_title']=$this->lang->line('membership_list');
		//$data['members'] =$this->membership->get_membership();
		//echo $members; exit;
		$this->load->view('membership-view',$data);
	}
	public function add()
	{
		$this->permission_check('customers_add');
		$data=$this->data;
		$data['page_title']=$this->lang->line('membership');
		$this->load->view('members',$data);
	}

	public function newmembers(){
		$this->form_validation->set_rules('member_name', 'Member Name', 'trim|required');
		
		
		if ($this->form_validation->run() == TRUE) {
			$result=$this->membership->verify_and_save();
			echo $result;
		} else {
			echo "Please Fill Compulsory(* marked) Fields.";
		}
	}
	public function update($id){
		$this->permission_check('customers_edit');
		$data=$this->data;
		$result=$this->membership->get_details($id,$data);
		$data=array_merge($data,$result);
		$data['page_title']=$this->lang->line('customers');
		$this->load->view('members', $data);
	}
	public function update_members(){
		$this->form_validation->set_rules('member_name', 'Member Name', 'trim|required');
		
		if ($this->form_validation->run() == TRUE) {			
			$result=$this->membership->update_members();
			echo $result;
		} else {
			echo "Please Fill Compulsory(* marked) Fields.";
		}
	}

	//public function show_total_customer_paid_amount($customer_id){
		//return $this->db->select("coalesce(sum(paid_amount),0) as tot")->where("customer_id",$customer_id)->get("db_sales")->row()->tot;
	//}
	public function member_list()
	{
		
		$list = $this->membership->get_datatables();
		//$list = $this->membership->get_datatables();
		//print_r($list); die;
		$data = array();
		$no = $_POST['start'];
		foreach ($list as $customers) {
			$no++;
			$row = array();
			$disable = ($customers->id==1) ? 'disabled' : '';
			if($customers->id==1){
				$row[] = '<span class="text-blue">NA</span>';	
			}
			else{
				$row[] = '<input type="checkbox" name="checkbox[]" '.$disable.' value='.$customers->id.' class="checkbox column_checkbox" >';
			}
			
			
			$row[] = $customers->name;
			$row[] = $customers->mobile;
			$row[] = $customers->address;
			$row[] = $customers->discount;
			//$row[] = app_number_format($this->show_total_customer_paid_amount($customers->id));
			
			
			 		if($customers->status==1){ 
			 			$str= "<span onclick='update_status(".$customers->id.",0)' id='span_".$customers->id."'  class='label label-success' style='cursor:pointer'>Active </span>";}
					else{ 
						$str = "<span onclick='update_status(".$customers->id.",1)' id='span_".$customers->id."'  class='label label-danger' style='cursor:pointer'> Inactive </span>";
					}
			$row[] = $str;			
					$str2 = '<div class="btn-group" title="View Account">
										<a class="btn btn-primary btn-o dropdown-toggle" data-toggle="dropdown" href="#">
											Action <span class="caret"></span>
										</a>
										<ul role="menu" class="dropdown-menu dropdown-light pull-right">';

											if($this->permissions('customers_edit')&& $customers->id!=1)
											$str2.='<li>
												<a title="Edit Record ?" href="customers/update/'.$customers->id.'">
													<i class="fa fa-fw fa-edit text-blue"></i>Edit
												</a>
											</li>';
											if($this->permissions('sales_payment_add'))
											$str2.='<li>
												<a title="Pay Opening Balance & Sales Due Payments" class="pointer" onclick="pay_now('.$customers->id.')" >
													<i class="fa fa-fw fa-money text-blue"></i>Pay Due Payments
												</a>
											</li>';
											if($this->permissions('sales_return_payment_add'))
											$str2.='<li>
												<a title="Pay Return Due" class="pointer" onclick="pay_return_due('.$customers->id.')" >
													<i class="fa fa-fw fa-money text-blue"></i>Pay Return Due
												</a>
											</li>';
											if($this->permissions('customers_delete') && $customers->id!=1)
											$str2.='<li>
												<a style="cursor:pointer" title="Delete Record ?" onclick="delete_customers('.$customers->id.')">
													<i class="fa fa-fw fa-trash text-red"></i>Delete
												</a>
											</li>
											
										</ul>
									</div>';			
			$row[] =  $str2;

			$data[] = $row;
		}

		$output = array(
						"draw" => $_POST['draw'],
						"recordsTotal" => $this->membership->count_all(),
						"recordsFiltered" => $this->membership->count_filtered(),
						"data" => $data,
				);
		//output to json format
		echo json_encode($output);
	}
	public function update_status(){
		$this->permission_check_with_msg('customers_edit');
		$id=$this->input->post('id');
		$status=$this->input->post('status');

		$result=$this->membership->update_status($id,$status);
		return $result;
	}
	
	public function delete_customers(){
		$this->permission_check_with_msg('customers_delete');
		$id=$this->input->post('q_id');
		return $this->membership->delete_members_from_table($id);
	}
	public function multi_delete(){
		$this->permission_check_with_msg('customers_delete');
		$ids=implode (",",$_POST['checkbox']);
		return $this->membership->delete_members_from_table($ids);
	}


}
