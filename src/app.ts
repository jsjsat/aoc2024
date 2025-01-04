import express from 'express';
import { Solution } from './solution';
import getSolution from './solutionindex';

const app = express();

app.get('/:id', async (req, res) => {
  let id = req.params.id;
  let solution = getSolution(id);
  res.send("<p style='font-family:monospace'>" + solution?.compute() + "</p>");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});