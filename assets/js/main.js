var userList;

function showInfo()
{
	var mPattern = /^1[3456789]\d{9}$/; 
	if(mPattern.test($("#number").val()) == false && document.getElementById('method').value == 'phone')
	{
		alert("手机格式错误，请重新输入");
		document.getElementById('number').value = "";
		document.getElementById('companyName').innerHTML = "";
		document.getElementById('clientName').innerHTML = "";
		document.getElementById('registerBtn').style.display = '';
	}
	else if($("#number").val() != "")
	{					
		$.ajax({  
			type: "POST",   //提交的方法
			datatype:"json",
			url:"check_exist.php", //提交的地址  
			data:$('#reservationForm').serialize(),// 序列化表单值  
			
			success: function(data) {  //成功
				console.log(data.state);  //就将返回的数据显示出来
				if (data.state == 'success')
				{
					userList = JSON.parse(data.return);
					
					if(userList.length != 0){
						var companyStr = "<option value = 'null'>[ 请选择公司 ]</option>";
						var clientStr = "<option value = 'null'>[ 请选择姓名 ]</option>";
						for(var i = 0; i < userList.length;i++)
						{
							companyStr = companyStr + "<option value = '"+ userList[i]['f_company_name'] +"'>"+userList[i]['f_company_name']+"</option>";
							clientStr = clientStr + "<option value = '"+userList[i]['f_fullname']+"'>"+userList[i]['f_fullname']+"</option>";
						}
						
						document.getElementById('companyName').innerHTML = companyStr;
						document.getElementById('clientName').innerHTML = clientStr;
						
						document.getElementById('registerBtn').style.display = 'none';
					}
					else
					{
						if( document.getElementById('method').value == 'code')
						{
							alert("输入的授权码不存在");
							document.getElementById('number').value = "";
							document.getElementById('companyName').innerHTML = "";
							document.getElementById('clientName').innerHTML = "";
							document.getElementById('registerBtn').style.display = '';
						}
						else if (document.getElementById('method').value == 'phone')
						{
							document.getElementById('number').value = "";
							alert("输入的手机号不存在");
							document.getElementById('companyName').innerHTML = "";
							document.getElementById('clientName').innerHTML = "";
							document.getElementById('registerBtn').style.display = '';
						}
					}
				}
				else
				{
					layui.layer.alert('传送失败, 请确认内容后,重新发送一次');
					document.getElementById('companyName').innerHTML = "";
					document.getElementById('clientName').innerHTML = "";
					document.getElementById('registerBtn').style.display = '';
				}
			},
		});
	}
	else
	{
		alert("请输入授权码或手机号");
		document.getElementById('companyName').innerHTML = "";
		document.getElementById('clientName').innerHTML = "";
		document.getElementById('registerBtn').style.display = '';
	}
}

function changeInfo()
{
	var nowClient = document.getElementById('clientName').value;
	var nowCompany = document.getElementById('companyName').value;
	
	if(nowClient == 'null' && nowCompany != 'null')
	{
		var clientStr = "<option value = 'null'>[ 请选择姓名 ]</option>";
		for(var i = 0; i < userList.length; i++)
		{
			if(userList[i]['f_company_name'] == nowCompany)
			{
				clientStr = clientStr + "<option value = '"+userList[i]['f_fullname']+"'>"+userList[i]['f_fullname']+"</option>";
			}
		}
		document.getElementById('clientName').innerHTML = clientStr;
	}
	else if(nowClient != 'null' && nowCompany == 'null')
	{
		var companyStr = "<option value = 'null'>[ 请选择公司 ]</option>";
		for(var i = 0; i < userList.length;i++)
		{
			if(userList[i]['f_fullname'] == nowClient)
			{
				companyStr = companyStr + "<option value = '"+ userList[i]['f_company_name'] +"'>"+userList[i]['f_company_name']+"</option>";
			}
		}
		document.getElementById('companyName').innerHTML = companyStr;
	}
}

function onSend()
{
	var client = document.getElementById('clientName').value;
	var company = document.getElementById('companyName').value;
	
	if(($("#number").val() != "") && (client != 'null') && (company != 'null'))
	{
		for(var i = 0; i < userList.length; i++)
		{
			if((userList[i]['f_fullname'] == client) && (userList[i]['f_company_name'] == company))
			{
				$.ajax({  
					type: "POST",   //提交的方法
					datatype:"json",
					url:"registration_send.php", //提交的地址  
					data:
					{
						f_user_id : userList[i]['f_user_id'],
						f_company_id : userList[i]['f_company_id'],
						f_authorkey_id : userList[i]['f_authorkey_id'],
						f_market_name : document.getElementById('market').value
					},
					success: function(data) {  //成功
						console.log(data.state);  //就将返回的数据显示出来
						if (data.state == 'success')
						{
							layui.layer.msg('传送成功',{time:5000});
							setTimeout(function(){$('#contactwModal').modal('hide');}, 5000);
						}
						else
						{
							layui.layer.alert('传送失败, 请确认内容后,重新发送一次');
						}
					},
				});
			}
		}
	}
	else
	{
		alert("请填写完整后再提交");
	}
}