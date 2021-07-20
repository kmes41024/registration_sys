<?php
	require_once($_SERVER['DOCUMENT_ROOT'].'encoding.php');
	require_once($_SERVER['DOCUMENT_ROOT'].'db/conn.php');
	require_once($_SERVER['DOCUMENT_ROOT']."mail/sendmail.php");
	require_once($_SERVER['DOCUMENT_ROOT'].'db/jsonResponse.php');
	session_start();

	$respData = array();
	$sqlAttr = array();
	
	$sqlAttr['method']=$_POST['method'];
	$sqlAttr['number']=$_POST['number'];
	
	if($sqlAttr['method'] == 'code')
	{
		$sql_1 = "SELECT *  FROM `t_company_authorkey` WHERE `f_key` = '".$sqlAttr['number']."'";
		$rs_1 = $conn->execute($sql_1);
		$len = count($rs_1);
		
		for($i = 0; $i < $len; $i++)
		{
			$respData[$i]['f_user_id'] = $rs_1[$i]['f_user_id'];
			$respData[$i]['f_company_id'] = $rs_1[$i]['f_company_id'];
			$respData[$i]['f_authorkey_id'] = $rs_1[$i]['id'];
			
			$sql_2 = "SELECT *  FROM `t_member` WHERE `id` = '".$rs_1[$i]['f_user_id']."'";
			$rs_2 = $conn->execute($sql_2);
			$respData[$i]['f_fullname'] = $rs_2[0]['f_fullname'];
			$respData[$i]['f_mobile'] = $rs_2[0]['f_mobile'];
			
			$sql_3 = "SELECT *  FROM `t_company_profile` WHERE `id` = '".$rs_1[$i]['f_company_id']."'";
			$rs_3 = $conn->execute($sql_3);
			$respData[$i]['f_company_name'] = $rs_3[0]['f_company_name'];
		}			
	}
	
	if($sqlAttr['method'] == 'phone')
	{
		$sql_1 = "SELECT *  FROM `t_member` WHERE `f_mobile` = '".$sqlAttr['number']."'";
		$rs_1 = $conn->execute($sql_1);
		$len = count($rs_1);
		
		for($i = 0; $i < $len; $i++)
		{
			$respData[$i]['f_user_id'] = $rs_1[$i]['id'];
			
			$sql_2 = "SELECT *  FROM `t_company_authorkey` WHERE `f_user_id` = '".$rs_1[$i]['id']."'";
			$rs_2 = $conn->execute($sql_2);
			$respData[$i]['f_authorkey_id'] = $rs_2[0]['id'];
			
			$respData[$i]['f_company_id'] = $rs_1[$i]['f_company_id'];
			$respData[$i]['f_fullname'] = $rs_1[$i]['f_fullname'];
			$respData[$i]['f_mobile'] = $sqlAttr['number'];
			
			$sql_3 = "SELECT *  FROM `t_company_profile` WHERE `id` = '".$rs_1[$i]['f_company_id']."'";
			$rs_3 = $conn->execute($sql_3);
			$respData[$i]['f_company_name'] = $rs_3[0]['f_company_name'];
		}
	}
	
	$return = json_encode($respData, JSON_UNESCAPED_UNICODE);
	
	$resp = array('state'=>'success','return'=>$return);
	echo json_encode($resp, JSON_UNESCAPED_UNICODE);
	exit;
?>