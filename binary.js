
        // Timer or sleep
        function sleep(milliseconds) {
            const date = Date.now();
            let currentDate = null;
            do {
              currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        }

        // store the value of room selected by user
        function store(x,y) {
            window.room=x;
            window.bed=y;
            sessionStorage.setItem('temp',null);
            console.log("Busy..."+"Selected Room is ITU "+room+", Selected Bed is CP-"+bed);
        }

        //Read the value selected by user
        function Read(){
            $.ajax({
            url: '/ret_num',
            type: 'POST',
            success: function(response) {
                console.log(response);
                if (response=='7'){
                    sessionStorage.setItem('var_battery','7');
                    $('#MessageField').html('Battery Low, int 7 from arduino');
                }
                if (response=='8'){
                    sessionStorage.setItem('var_status','8');
                    $('#MessageField').html('Robot.. Ready for the input, int 8 from arduino');
                    var button_temp=document.querySelector('#confirm');
                    button_temp.disabled=false;
                }
                if (response=='11'){
                    $('#MessageField').html('Robot Busy... int 11 from arduino');
                    var button_temp=document.querySelector('#confirm');
                    button_temp.disabled=true;
                }
                else {
                    $('#MessageField').html(response);
                }
            },
            error: function(error) {
                console.log(error);
            },
            complete: function(){
                setTimeout(Status,500);
            }
            });
        };

        // Sending room value to server and refreshing page to home
        function Send(){
            sessionStorage.setItem('var_room',room);
            sessionStorage.setItem('var_bed',bed);
            sessionStorage.setItem('temp',1);
            window.location.href=room+"/"+bed;
            console.log("Selected room is "+room+", selected bed is "+bed);
            sleep(1000);
            console.log("sent");
            window.location.href="/";
        }

        temp=sessionStorage.getItem('temp');

        if(temp!=null){
            Status()
        }
        else{
            document.getElementById("StatusField").placeholder="Please Select the destination";
        }
        function Status(){
        console.log("in status")
        var_room=sessionStorage.getItem('var_room');
        var_bed=sessionStorage.getItem('var_bed');
        status=sessionStorage.getItem('var_status')
        if(status!='8'){
            if(var_room!=null){
                if (var_room==1 && var_bed==3){
                    document.getElementById("StatusField").placeholder="Busy... Charging...";
                }
                else if (var_room==5 && var_bed==5){
                    document.getElementById("StatusField").placeholder="Busy..."+"Reception is Selected";
                }
                else if (var_room==1 && var_bed==4){
                    document.getElementById("StatusField").placeholder="Busy..."+"Selected Room is ITU 1, Selected Bed is CP-3";
                }              
                else {
                    document.getElementById("StatusField").placeholder="Busy..."+"Selected Room is ITU "+var_room+", Selected Bed is CP-"+var_bed;
                }
            }
        }
        if (status=='8' || var_room==null){
            document.getElementById("StatusField").placeholder="Please Select the destination";
            sessionStorage.clear();
        }

        battery=sessionStorage.getItem('var_battery')
        if(battery=='7'){
            alert("Battery Low, Please select 'Go to Charging'");
            document.getElementById("charging_button").className = "btn btn-warning";
        }

        Read();
        }

        // message the user about battery low
        function Charging(){
            window.location.href=1+"/"+3;
            console.log("Charging");
            sleep(1000);
            window.location.href="/";
            document.getElementById("StatusField").placeholder="Busy... Charging";
        }

        // Reset the robot
        function Reset(){
            window.location.href=6+"/"+1;
            console.log("Resetting");
            sleep(1000);
            window.location.href="/";
            document.getElementById("StatusField").placeholder="Resetting...";
        }