import React from 'react'
import {
  Dialog,
  Grid,
  makeStyles,
  Button,
  Slide,
  TransitionProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme)=>({
  root :{

  }
}))


function RegisConfirmDialog({open,handleClose,handleConfirm}) {
  const classes = useStyles()



  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Grid>
      <DialogTitle >{"ต้องการสมัคร Account ใหม่หรือไม่ ?"}</DialogTitle>
        <DialogActions>
          <Button onClick={()=>{handleClose();handleConfirm(false)}} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={()=>{handleClose();handleConfirm(true);}} color="primary">
            ยืนยันการสมัคร
          </Button>
        </DialogActions>
      </Grid>
    </Dialog>
  )
}

export default RegisConfirmDialog