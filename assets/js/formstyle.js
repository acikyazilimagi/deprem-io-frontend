const requiredFields = document.querySelectorAll(".required-field[required]");
        
        requiredFields.forEach(field => {
          field.style.borderColor = "red";
          field.style.color = "#08dbeb";
      
          field.addEventListener("input", () => {
            if (field.value === "") {
              field.style.borderColor = "red";
            } else {
              field.style.borderColor = "#33ff00";
            }
          });
        });