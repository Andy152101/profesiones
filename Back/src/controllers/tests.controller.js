import Tests from '../models/tests.models.js'

const errorHandler = (err) => {
  console.error(err);  // Para ver el error en la consola
  return {
      status: err.status || 500,
      message: err.message || 'Internal Server Error'
  };
};

export const getTests = async (req,res) =>{
    try {
        let query = req.query || {};
        const result = await Tests.find(query);
    
        return res.status(200).json(result);
      } catch (err) {
        console.error("Tests getAll failed: " + err);
        const { status, message } = errorHandler(err)
        res.status(status).json({ message, entity: 'Tests' })
      }

};
export const createTests = async (req,res)=>{
    try {
        const item = new Tests(req.body);
        const result = await item.save();
        return res.status(200).json(result);
      } catch (err) {
        console.error("Tests creation failed: " + err);
        const { status, message } = errorHandler(err)
        res.status(status).json({ message, entity: 'Tests' })
      }

};
export const getTest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'ID is required' });
    const result = await Tests.findById(id);
    if (!result) return res.status(404).json({ message: 'Test not found' });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Tests getById failed: " + err);
    const { status, message } = errorHandler(err);
    res.status(status).json({ message, entity: 'Tests' });
  }
};
export  const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTest = await Tests.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTest) {
      return res.status(404).send('Test not found');
    }
    res.status(200).json(updatedTest);
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).send('Server error');
  }
};

export const deleteTest = async(req,res)=>{
    try {
        const { id } = req.params;
    
        const result = await Tests.deleteOne({ _id: id });
        return res.status(200).json(result);
      } catch (err) {
        console.error("Tests delete failed: " + err);
        const { status, message } = errorHandler(err)
        res.status(status).json({ message, entity: 'Tests' })
      }

};
